import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { getCustomers, type CustomerSegment } from "@/services/customerService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CustomerListItem = Awaited<ReturnType<typeof getCustomers>>[number];

const PAGE_SIZE = 10;

const segmentMeta: Record<CustomerSegment, { label: string; variant: "default" | "secondary" | "outline" }> = {
  vip: { label: "VIP", variant: "default" },
  new: { label: "جديد", variant: "secondary" },
  inactive: { label: "غير نشط", variant: "outline" },
  regular: { label: "منتظم", variant: "secondary" },
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function CustomersList() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<"all" | CustomerSegment>("all");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        if (active) {
          setCustomers(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "تعذر تحميل العملاء");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        query === "" ||
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        (customer.email || "").toLowerCase().includes(query);
      const matchesSegment = segmentFilter === "all" || customer.segment === segmentFilter;

      return matchesSearch && matchesSegment;
    });
  }, [customers, deferredSearch, segmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, segmentFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredCustomers]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border-border/60 bg-card/95">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-primary">CRM</p>
            <CardTitle className="mt-2 text-3xl">إدارة العملاء</CardTitle>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث بالاسم أو الجوال"
                className="pr-10"
              />
            </div>

            <Select value={segmentFilter} onValueChange={(value) => setSegmentFilter(value as "all" | CustomerSegment)}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الشريحة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الشرائح</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="regular">منتظم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
              <p className="mt-2 text-3xl font-bold">{customers.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">نتائج البحث</p>
              <p className="mt-2 text-3xl font-bold">{filteredCustomers.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">عملاء VIP</p>
              <p className="mt-2 text-3xl font-bold">{customers.filter((customer) => customer.segment === "vip").length}</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الجوال</TableHead>
                  <TableHead className="text-right">البريد</TableHead>
                  <TableHead className="text-right">الحجوزات</TableHead>
                  <TableHead className="text-right">الشريحة</TableHead>
                  <TableHead className="text-right">آخر حجز</TableHead>
                  <TableHead className="text-right">الإجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={7} className="h-14 text-center text-muted-foreground">
                        جاري تحميل البيانات...
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
                      لا توجد نتائج مطابقة.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.email || "—"}</TableCell>
                      <TableCell>{customer.bookingsCount}</TableCell>
                      <TableCell>
                        <Badge variant={segmentMeta[customer.segment].variant}>{segmentMeta[customer.segment].label}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(customer.last_booking_date)}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/customers/${customer.id}`}>عرض الملف</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              الصفحة {currentPage} من {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((value) => value - 1)}>
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
